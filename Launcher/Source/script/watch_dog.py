from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from requests import post
from handle_data import *
from os.path import dirname
from os import getcwd
from sys import stdout
from threading import Thread

def postMatch(match_id, game, map, tempolary, log_start_time):
    stdout.write(tempolary)
    body = {}
    body["start_time"] = parse_game_session_start_time(tempolary, map, log_start_time)
    body["game_mode"] = game
    body['map_name'] = map
    respond = post('https://dry-eyrie-39715.herokuapp.com/api/match', json=body)
    match_id[0] = respond.json()["record"]['match_id']


def postEndMatch(match_id, tempolary, log_start_time):
    stdout.write(tempolary)
    body = {
        'end_time' : parse_game_session_end_time(tempolary, log_start_time)
    }
    post('https://dry-eyrie-39715.herokuapp.com/api/match/end/%s' % match_id[0], json=body)


def postMatchFrags(match_id, tempolary, log_start_time):
    stdout.write(tempolary)
    body = parse_frags(tempolary, log_start_time, match_id[0])
    post("https://dry-eyrie-39715.herokuapp.com/api/match/frags", json=body)


class FileModifiedHandler(FileSystemEventHandler):

    def __init__(self, path, log_file):
        self.file_name = 'log.txt'
        self.path = path + '\\' + self.file_name
        self.map = ''
        self.game = ''
        self.log_file = log_file
        self.url = ''
        self.log_start_time = ''
        # self.start_match
        self.match_id = [-1]
        # set observer to watch for changes in the directory
        self.observer = Observer()
        self.observer.schedule(self, path, recursive=False)
        self.observer.start()
        self.observer.join()

    def on_modified(self, event):
        # only act on the change that we're looking for
        if not event.is_directory and event.src_path.endswith(self.file_name):
            tempolary = self.log_file.readline()
            if 'killed' in tempolary:
                t_match_frags = Thread(target=postMatchFrags, args=(self.match_id, tempolary, self.log_start_time))
                t_match_frags.start()
            elif 'Log Started' in tempolary:
                stdout.write(tempolary)
                self.log_start_time = parse_log_start_time(tempolary)
            elif 'g_timezone' in tempolary:
                stdout.write(tempolary)
                self.log_start_time = add_timezone(tempolary, self.log_start_time)
            elif 'Loading level' in tempolary:
                stdout.write(tempolary)
                self.game, self.map = parse_match_game_mode_and_map_name(tempolary)
            elif 'loaded in' in tempolary:
                t_match = Thread(target=postMatch, args=(self.match_id, self.game, self.map, tempolary, self.log_start_time))
                t_match.start() 
            elif 'Statistics' in tempolary:
                t_end_match = Thread(target=postEndMatch, args=(self.match_id, tempolary, self.log_start_time))
                t_end_match.start()
               

if __name__ == '__main__':
    f = open('script\\path.txt', 'r')
    data = dirname(dirname(f.read()))
    f.close()
    log_file = open(data + '\\' + 'log.txt', 'r')
    FileModifiedHandler(data, log_file)
    log_file.close()