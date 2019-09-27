from requests import get
from sys import argv


def main():
    respond = get('https://dry-eyrie-39715.herokuapp.com/api/player/setting/%s' % argv[4])

    file_game = open(argv[1] + '\\' + argv[2], 'w')
    file_game.write(respond.json()['result']['system'])
    file_game.close()

    file_system = open(argv[1] + '\\' + argv[3], 'w')
    file_system.write(respond.json()['result']['game'])
    file_system.close()


if __name__ == '__main__':
    main()