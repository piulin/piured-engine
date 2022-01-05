# PIURED: A Web-based Pump It Up Engine
![PIURED](https://github.com/piulin/piured/blob/main/imgs/piuredg.gif?raw=true)


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
4. Support for changes of BPM, SCROLL, STOPS, DELAYS as well as changes of SPEED (attributes used in Stepmania to create effects).
3. Pump-single and Pump-double styles.
4. VS. mode, including two players playing any combination of Pump-single and Pump-double styles.
5. On-the-fly tuning of the offset parameter.
6. Variable speed rates.
7. A number of Noteskins to choose from (sprite-based).
8. Game performance metrics.
9. Visual effects close to the original arcade.
10. A background theme which "FEELS THE BEAT".

### Limitations

There are, however, some features available in Stepmania that
PIURED does not support:

2. The engine only supports a 4/4 bar.
3. BGA in any video format is not supported.
4. Dance pads or Joysticks are not supported as input methods.
5. Performance metrics may not be deterministic.
6. Only Pump-single, Pump-double and Pump-halfdouble styles are supported. Any other style may cause 
the engine to crash.

## Contributing

Do you think everything is wrong? Don't you like what you see? I'd love to hear from you!
You can always get in touch with me by dropping an e-mail at <pepo_gonba@hotmail.com>. 
If you feel like getting your hands dirty, you can also
submit a pull request!

## Future Work

This project is currently being migrated to Godot. The final goal is to create a battle
platform, similar in style and functionality to [lichess](https://lichess.org).

## License

This project is licensed under the terms of the GPL-3.0 license.
