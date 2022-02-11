# PIURED: A Web-based Pump It Up Engine
![PIURED](https://github.com/piulin/piured-engine/blob/main/imgs/piuredg.gif?raw=true)


## Introduction

PIURED is a Pump It Up stage simulator that works directly in your browser.
There are already a number of dance simulators for Windows and Linux, most of them being StepMania-based. 
Stepmania is a great choice for DDR-style rhythm games, however it lacks to capture the behaviour as well as
the feel & look of a Pump It Up arcade. 

In this sense, PIURED's goal is to recreate as accurately as possible the Pump It Up-style experience
whilst keeping the engine cross-platform (web-based), so it can be enjoyed anywhere and anytime.

## Engine Review

PIURED is written in its whole in Javascript using [ThreeJS](https://threejs.org/). The code is organized
trying to mimick the structure of any game engine. The source code can be found in this repo under the folder `js`.

### Features

PIURED's engine features:

1. A Stepmania SSC parser. Stepcharts can be directly read from bare Stepmania files. No need to
convert them into another intermediate format. This means that all the songs that are available for Pump-style
   would work off-the-shelf in PIURED.
2. A loader that supports both MP3 and OGG audio formats. These are the most common formats used in Stepmania audio files.
3. Support for changes of BPM, SCROLL, STOPS, DELAYS, WARPS as well as changes of SPEED (Gimmicks).
4. Pump-single, Pump-double and Pump-Halfdouble styles.
5. VS. mode, including two or more players playing any combination of Pump-single and Pump-double styles.
6. Remote input capabilities to create online-like battles. 
7. On-the-fly tuning of the offset parameter.
8. Variable speed rates.
9. A number of Noteskins to choose from (sprite-based).
10. Game performance metrics.
11. Visual effects close to the original arcade.
12. A background theme which "FEELS THE BEAT".

### Limitations

There are, however, some features available in Stepmania that
PIURED does not support:

1. The engine only supports a 4/4 bar.
2. BGA in any video format is not supported.
3. Dance pads or Joysticks are not supported as input methods.
4. Performance metrics may not be deterministic.
5. Only Pump-single, Pump-double and Pump-halfdouble styles are supported. Any other style may cause 
the engine to crash.

## Contributing

Do you think everything is wrong? Don't you like what you see? I'd love to hear from you!
You can always get in touch with me by dropping an e-mail at <pepo_gonba@hotmail.com>. 
If you feel like getting your hands dirty, you can also
submit a pull request!

## API

In the case you want to use the engine in your web application, you can learn more [here](https://piulin.github.io/piured-engine). 
To see a working example, you can always have a look at the code of PIURED's [demo web](https://github.com/piulin/piured).

## Online Demo

If you only care about playing pump it up and not that much about the code, just go to the [demo web](https://piulin.github.io/piured/) and
play some charts!


## Future Work

This project is currently being migrated to Godot. The final goal is to create a battle
platform, similar in style and functionality to [lichess](https://lichess.org).

## License

This project is licensed under the terms of the GPL-3.0 license.
