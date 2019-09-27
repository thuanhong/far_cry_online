#!/usr/bin/env python3
from datetime import datetime, timezone, timedelta
from re import findall


def parse_log_start_time(log_data):
    """
    get a object datetime representing time the FarCry engine began to log event
    @param log_data : the data read from a far Cry server's log file
    @return a object datetime.datetime
    """
    # format of first line in log file
    format_log_date = 'Log Started at %A, %B %d, %Y %X\n'
    return datetime.strptime(log_data, format_log_date)


def add_timezone(log_data, obj_datetime):
    tz = log_data.partition('g_timezone,')[-1].partition(')')[0]
    obj_datetime = obj_datetime.replace(tzinfo = timezone(timedelta(hours=int(tz))))
    return obj_datetime


def parse_log_time(obj_log_time, time_string):
    """
    convert time ingame become object datetime
    @param obj_log_time : object datetime representing time the FarCry engine began to log event
    @param time_string : time ingame when have a event (a player kill or be kill by another player) (format : 'MM:SS')
    @return object datetime representing time
    """
    delta_second = int(time_string[3:]) - obj_log_time.second
    delta_minute = int(time_string[:2]) - obj_log_time.minute
    # change current hours if minute over 59
    if delta_minute < 0:
        delta_hour = 1
    else:
        delta_hour = 0
    obj_datetime = obj_log_time + timedelta(hours=delta_hour,
                                            minutes=delta_minute,
                                            seconds=delta_second)
    return obj_datetime.strftime('%Y-%m-%d %H-%M-%S')


def parse_match_game_mode_and_map_name(log_data):
    """
    take game mode and map name in log file
    @param log_data : the data read from a far Cry server's log file
    @return a tuple (game_mode, map_name)
    """
    temporary = log_data.partition('Loading level Levels/')[-1].partition(' -')[0]
    temporary = temporary.split()
    return (temporary[-1], temporary[0][:-1])


def parse_game_session_start_time(log_data, map_name, obj_datetime):
    """
    get start time of session
    @param log_data : the data read from a far Cry server's log file
    @param map_name : map name
    @param obj_datetime : object datetime representing time the FarCry engine began to log event
    @return the approximate start time of the game session
    """
    start_time = log_data.partition('  Level ' + map_name + ' loaded in ')[0][-6:-1]
    start_time = parse_log_time(obj_datetime, start_time)
    return start_time


def parse_game_session_end_time(log_data, obj_datetime):
    """
    get end time of session
    @param log_data : the data read from a far Cry server's log file
    @param obj_datetime : object datetime representing time the FarCry engine began to log event
    @return the approximate end time of the game session
    """
    end_time = log_data.partition('Statistics')
    end_time = end_time[0][-10:-5]
    end_time = parse_log_time(obj_datetime, end_time)
    return end_time



def parse_frags(log_data, obj_datetime, match_id):
    """
    take a list contain all event when a player kill or be kill by another player
    the list include (datetime.datetime(), killer name, victim name, weapon name) or
                     (datetime.datetime(), killer name) if the player suicide
    @param log_data : the data read from a far Cry server's log file
    @param obj_datetime : object datetime representing time the FarCry engine began to log event
    @return a list of frags
    """
    temp_list = list(findall('<[-0-9]+:[0-9]+> <Lua> (\w+) killed (?:itself|([\\w ]+) with (\\w+))', log_data)[0])
    new_datetime = parse_log_time(obj_datetime, log_data[1:6])
    if not 'itself' in log_data: # when the player kill another player
        output = [new_datetime] + temp_list
        return {
            "match_id": match_id,
            "frag_time" : output[0],
            "killer_name" : output[1],
            "victim_name" : output[2],
            "weapon_code" : output[3]
        }
    else: # when the player kill itself
        output = [new_datetime] + temp_list[:-2]
        return {
            "match_id": match_id,
            "frag_time" : output[0],
            "killer_name" : output[1],
        }