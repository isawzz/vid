# RSG: frontend implementation for GSM / Ludos

installation:

- > git clone https://github.com/isawzz/vid

- install first humpack then gsm from code directories > pip install -e . 

- install other required packages (eg., pip install -r requirements.txt)
- > pip install -r requirements.txt --user

- > python runhost.py

(hab es nicht geschafft mit venv, und es kann leicht sein dass requirements.txt nicht alles enthaelt, aber dann complaint er eh. manchmal geht auch statt 'pip install' 'python -m pip install...', da kennst du dich eh sicher gut aus. ich hatte hauptsaechlich probleme mit dependencies, version comflicts und env probleme bis es endlich alles in vs code (auf dem LG gram) jetzt geht! laeuft aber gut!)

This project provides a simple javascript frontend for GSM\*/Ludos games:

1. the game backend is implemented in python.

2. backend - frontend interface is simply the game data as JSON structure (as defined in Ludos).

3. RSG just presents the data and the list of possible interactions in a semi-automatic way and sends back the selected interaction to the server.

4. semi-automatic UI generation:

- in principle the UI can be generated completely automatically without spec or code (see 'plain' display mode)
- however, incrementally, the UI can be refined by the user (=developer of the game) adding static spec or dynamic behaviors which refer to the spec.

two examples have been implemented:

- Tic Tac Toe: simple toy game in order to connect the different pieces
- Catan\*: a bit more complex, but as you will see, not much more code is actually needed for the presentation

Note: HAS ONLY BEEN TESTED ON **_ GOOGLE CHROME _**

Troubleshooting: use F12 in Chrome to see error messages

\*1: using an older GSM / Ludos version!

\*2: only the setup phase really works
