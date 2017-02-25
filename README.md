[![Dependency Status](https://david-dm.org/plantain-00/baogame.svg)](https://david-dm.org/plantain-00/baogame)
[![devDependency Status](https://david-dm.org/plantain-00/baogame/dev-status.svg)](https://david-dm.org/plantain-00/baogame#info=devDependencies)
[![Build Status](https://travis-ci.org/plantain-00/baogame.svg?branch=master)](https://travis-ci.org/plantain-00/baogame)

# baogame

a html5 mutiplayer game

![demo](https://raw.githubusercontent.com/plantain-00/baogame/master/doc/demo1.gif)

#### install

```bash
git clone -b release https://github.com/plantain-00/baogame.git . --depth=1 && npm i --production
```

```bash
node dist/app.js
```

Then open http://localhost:8030 in your browser.

#### CLI parameters

key | default value | description
--- | --- | ---
p | 8030 | port
h | localhost | host

#### environment variables

key | default value | description
--- | --- | ---
BAO_DEFAULT_ROOM_ADMIN_CODE | "admin" | admin code of the default room
BAO_MAX_USER | 10 | the max user count of a room

#### create room named "test" and set its admin code

`/createRoom?name=test&code=admin`

#### access admin page of a room by its admin code

`/admin.html?code=admin&roomId=1`
