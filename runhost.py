#...#!/var/www/html/flask/scriptapp/scriptapp-venv/bin/python3

#region imports
import argparse
import http
import json
import os
import sys
import traceback

import games
import gsm
from flask import Flask, request, send_from_directory
from flask_cors import CORS
from gsm.io.transmit import LstConverter, create_dir

SAVE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'saves')

null = http.HTTPStatus.NO_CONTENT
#endregion

#region app
app = Flask(__name__, static_url_path='', static_folder='')
app.url_map.converters['lst'] = LstConverter
CORS(app)

#endregion

#region fe code
def _fmt_output(data):
	return json.dumps(data)

def _ex_wrap(cmd, *args, **kwargs):
	try:
		return cmd(*args, **kwargs)
	except Exception as e:
		if isinstance(e, gsm.signals.WrappedException):
			msg = {'error': {'type': str(e.etype), 'msg': e.emsg}}
		else:

			msg = {
			    'error': {
			        'type': e.__class__.__name__ if '__name__' in e.__class__ else e.__class__,
			        'msg': ''.join(traceback.format_exception(*sys.exc_info())),
			    },
			}
		return _fmt_output(msg)

# Meta Host

H = None

@app.route('/restart')
@app.route('/restart/<int:debug>')
def _hard_restart(address=None, debug=False, **settings):
	global H

	address = 'http://localhost:5000'

	if address is None:
		assert H is not None, 'must provide an address if no host is running'
		address = H.address

	debug = bool(debug)

	H = gsm.Host(address, debug=debug, **settings)
	return 'Host restarted (debug={})'.format(debug)

@app.route('/cheat')
@app.route('/cheat/<code>')
def _cheat(code=None):
	return _ex_wrap(H.cheat, code)

# Game Info and Selection

@app.route('/game/info')
@app.route('/game/info/<name>')
def _get_game_info(name=None):
	x = _ex_wrap(H.get_game_info, name)
	y = _fmt_output(_ex_wrap(H.get_game_info, name))
	return _fmt_output(_ex_wrap(H.get_game_info, name))

@app.route('/game/available')
def _get_available_games():
	return _fmt_output(_ex_wrap(H.get_available_games))

@app.route('/game/select/<name>')
def _set_game(name):
	return _ex_wrap(H.set_game, name)

@app.route('/game/players')
def _get_available_players():
	return _fmt_output(_ex_wrap(H.get_available_players))

@app.route('/setting/<key>/<value>')
def _setting(key, value):
	return _ex_wrap(H.set_setting, key, value)

@app.route('/del/setting/<key>')
def _del_setting(key):
	return _ex_wrap(H.del_setting, key)

@app.route('/clear/settings')
def _clear_settings():
	return _ex_wrap(H.clear_settings)

@app.route('/settings', methods=['POST'])  # post data contains settings to be added (!)
def _update_settings():
	settings = request.get_json(force=True)
	return _ex_wrap(H.update_settings, settings)

# Managing clients

@app.route('/add/client/<interface>/<lst:users>', methods=['POST'])  # post data are the interface settings
@app.route('/add/client/<lst:users>', methods=['POST'])  # post data is the passive frontend address
def _add_passive_client(users, interface=None):

	address = request.get_json(force=True) if interface is None else None
	settings = {} if interface is None else request.get_json(force=True)

	return _ex_wrap(H.add_passive_client, *users, address=address, interface=interface, settings=settings)

@app.route('/ping/clients')
def _ping_clients():
	return _ex_wrap(H.ping_interfaces)

# Adding Players, Spectators, and Advisors

@app.route('/add/player/<user>/<player>')
def _add_player(user, player):
	return _ex_wrap(H.add_player, user, player)

@app.route('/add/spectator/<user>')
def _add_spectator(user):
	return _ex_wrap(H.add_spectator, user)

@app.route('/add/advisor/<user>/<player>')
def _add_advisor(user, player):
	return _ex_wrap(H.add_spectator, user, player)

# Game Management

@app.route('/begin')
@app.route('/begin/<int:seed>')
def _begin_game(seed=None):
	return _ex_wrap(H.begin_game, seed)

@app.route('/save/<name>')
@app.route('/save/<name>/<overwrite>')
def _save(name, overwrite='false'):

	if H.game is None:
		raise Exception('No game selected')

	filename = '{}.gsm'.format(name)
	filedir = os.path.join(SAVE_PATH, H.info['short_name'])

	if H.info['short_name'] not in os.listdir(SAVE_PATH):
		create_dir(filedir)

	if overwrite != 'true' and filename in os.listdir(filedir):
		raise Exception('This savefile already exists')

	return _ex_wrap(H.save_game, os.path.join(filedir, filename), save_interfaces=True)

@app.route('/load/<name>')
@app.route('/load/<name>/<load_interfaces>')
def _load(name, load_interfaces='true'):

	if H.game is None:
		raise Exception('No game selected')

	filename = '{}.gsm'.format(name)
	filedir = os.path.join(SAVE_PATH, H.info['short_name'])

	if H.info['short_name'] not in os.listdir(SAVE_PATH):
		return

	return _ex_wrap(H.load_game, os.path.join(filedir, filename), load_interfaces == 'true')

# In-game Operations

@app.route('/autopause')
def _toggle_autopause():
	return _ex_wrap(H.toggle_pause)

@app.route('/continue')
@app.route('/continue/<user>')
def _continue(user=None):
	return _ex_wrap(H.continue_step, user)

@app.route('/action/<user>/<key>/<group>/<lst:action>')
def _action(user, key, group, action):
	return _ex_wrap(H.take_action, user, group, action, key)

@app.route('/advise/<user>/<group>/<lst:action>')
def _advise(user, group, action):
	return _ex_wrap(H.give_advice, user, group, action)

@app.route('/status/<user>')
def _get_status(user):
	return _ex_wrap(H.get_status, user)

@app.route('/log/<user>')
@app.route('/log/<user>/<god>')
def _get_log(user, god='false'):
	return _ex_wrap(H.get_log, user, god == 'true')

@app.route('/roles')
def _get_roles():
	return _ex_wrap(H.get_roles)

@app.route('/active')
def _get_active_players():
	return _ex_wrap(H.get_active_players)

#endregion

#region socketio: chat and messaging
# USE_SOCKETIO=True
# from flask_socketio import SocketIO, emit
# #import eventlet

# #if USE_SOCKETIO:
# #eventlet.monkey_patch()
# socketio = SocketIO(app)

# @socketio.on('message')
# def handleMessage(msg):
# 	#print('Message: ' + msg)
# 	emit('message', msg, broadcast=True)

# @socketio.on('chat')
# def handleChatMessage(msg):
# 	#print('Chat message: ' + msg)
# 	emit('chat', msg, broadcast=True)

#endregion

#region login
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, current_user, login_user, logout_user, login_required

db_path = os.path.join(os.path.dirname(__file__), 'login.db')
db_uri = 'sqlite:///{}'.format(db_path)
app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
app.config['SECRET_KEY'] = 'IJustHopeThisWorks!'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)

usersLoggedIn = []

class User(UserMixin, db.Model):
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(30), unique=True)

@login_manager.user_loader
def load_user(user_id):
	return User.query.get(int(user_id))

@app.route('/loginTest')
def defaultLogin():
	user = User.query.filter_by(username='felix').first()
	login_user(user)
	return 'You are logged in!'

@app.route('/login/<username>')
def login(username):
	user = User.query.filter_by(username=username).first()
	if username in usersLoggedIn:
		return username + ' already logged in in another window!'
	if not user:
		#TODO: add this user to db
		# print('found user!!!')
		return 'not authorized: ' + username
	usersLoggedIn.append(username)
	login_user(user)
	print('logged in', username, usersLoggedIn, '................')
	return username

@app.route('/logout/<username>')
@login_required
def logout(username):
	if not username in usersLoggedIn:
		print(username, 'not in usersLoggedIn!!!!!')
	else:
		usersLoggedIn.remove(username)
	logout_user()
	print('logged out', username, usersLoggedIn, '................')
	return username + ', you are logged out!'

@app.route('/lobby')
@login_required
def lobby():
	return current_user.username

#endregion

#region helpers front routes
import yaml

def _asText(path):
	f=open(path, "r")
	txt = f.read()
	# print(txt)
	return txt

def _fromRoot(path):
	rootPath = os.path.dirname(os.path.abspath(__file__))  #path of this file app_interface.py
	path = os.path.join(rootPath, path)
	return path

def _makePath(game,file=None,ext='yaml'):
	fname = file if file else game+'_ui'
	partial = 'games/' + game + '/_rsg/' + fname + '.' + ext
	path = _fromRoot(partial)
	print(path)
	return path

def userSpecPath(game, ext, file):
	rootPath = os.path.dirname(os.path.abspath(__file__))  #path of this file app_interface.py
	fname = file if file else game+'_ui'
	path = os.path.join(rootPath, 'games/' + game + '/_rsg/' + fname + '.' + ext)
	print(path)
	return path

def ymlFile_jString(path):
	try:
		content = open(path, 'r')
		return json.dumps(yaml.load(content))
	except Exception as e:
		msg = 'no such file' + path
		print(msg)
		return msg

def ymlText(path):
	return yaml.load(open(path, 'r'))

def ymlFile_pyObject(path):
	return yaml.load(open(path, 'r'))



#endregion

#region frontend
static_folder = 'frontend/templates'

@app.route('/')
@app.route('/demo/')
def demo():
	return send_from_directory(static_folder, 'index.html')

@app.route('/<path:path>')
def demo_path(path):
	res = send_from_directory('', path)
	return res

@app.route('/behaviors/<game>')
def demo_code(game):
	path = userSpecPath(game,'js',None)
	f=open(path, "r")
	txt = f.read()
	# print(txt)
	return txt

@app.route('/get_UI_spec/<game>')
@app.route('/get_UI_spec/<game>/<v>')
def demo_get_UI_spec(game,v=None):
	path = userSpecPath(game,'yaml',v)
	res = ymlFile_jString(path) #ymlText(path) 
	return res

@app.route('/loadYML/<fname>')
def demo_loadYML(fname):
	rootPath = os.path.dirname(os.path.abspath(__file__))  #path of this file app_interface.py
	path = os.path.join(rootPath, 'static/rsg/assets/' + fname + '.yml')
	res = ymlFile_jString(path) #ymlText(path) 
	return res

@app.route('/save_UI_spec/<game>/<code>')
@app.route('/save_UI_spec/<game>/<code>/<v>')
def demo_save_UI_spec(game,code,v=None):
	path = userSpecPath(game,'yaml',v)
	f = open(path,"w+")
	f.write(code)
	return path

@app.route('/save_UI_code/<game>/<code>')
@app.route('/save_UI_code/<game>/<code>/<v>')
def demo_save_UI_code(game,code,v=None):
	path = userSpecPath(game,'yaml',v)
	f = open(path,"w+")
	f.write(code)
	return path

#endregion

@app.route('/<path:path>')
def vid2_path(path):
	res = send_from_directory('', path)
	return res

@app.route('/text/<path:path>')
def rootsimTextPath(path):
	return _asText(_fromRoot(path))

@app.route('/spec/<game>')
@app.route('/spec/<game>/<file>')
def _rootsimSpec(game, file=None):
	path = _makePath(game,file)
	return _asText(path)

@app.route('/code/<game>')
@app.route('/code/<game>/<file>')
def _rootsimCode(game, file=None):
	path = _makePath(game,file,'js')
	return _asText(path)

#endregion

def main(argv=None):
	parser = argparse.ArgumentParser(description='Start the host server.')

	parser.add_argument('--host', default='localhost', type=str, help='host for the backend')
	parser.add_argument('--port', default=5000, type=int, help='port for the backend')

	parser.add_argument('--settings', type=str, default='{}', help='optional args for interface, specified as a json str (of a dict with kwargs)')

	args = parser.parse_args(argv)

	address = 'http://{}:{}/'.format(args.host, args.port)
	settings = json.loads(args.settings)

	_hard_restart(address, **settings)

	app.run(host=args.host, port=args.port)
	#socketio.run(app, host=args.host,port=args.port) #, debug=True)

if __name__ == "__main__":
	main()
