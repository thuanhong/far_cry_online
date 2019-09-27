from requests import post
from sys import argv


def config():
    body = {}

    file_game = open(argv[1] + '\\' + argv[2], 'r')
    body["system"] = file_game.read()
    file_game.close()

    file_system = open(argv[1] + '\\' + argv[3], 'r')
    body["game"] = ''.join([x for x in file_system if (x[:2] not in ['s_', 'r_'])])
    file_system.close()

    post('https://dry-eyrie-39715.herokuapp.com/api/player/setting/%s' % argv[4], json=body)

if __name__ == '__main__':
    config()