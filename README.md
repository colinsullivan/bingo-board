# Bingo!

## Why?
My family plays Bingo every New Years day.  When many loud drunken italians join the game it becomes very difficult to hear what numbers have been called.  This application allows any web browser to display the current bingo board.

## Demo
A live demo is running here:
[http://app.bingo-board.org](http://app.bingo-board.org/)

## Development
This software was written using the [Django](http://www.djangoproject.com/) framework and [django-tastypie](https://github.com/toastdriven/django-tastypie) for a REST interface.  On the frontend is some [Backbone.js](http://documentcloud.github.com/backbone/) classes which are a little messy but do the job for now, as well as CSS3 transitions and animations.  See below for other dependencies and such and feel free to contact me &lt;colinsul [at] gmail.com&gt; if you have any questions.

### Dependencies & Installation
This application is built to run on Google's App Engine, and thus all of the dependencies must be copied into the project folder as opposed to installed on your system.  

You also need to use the django-nonrel package because GAE uses a non-relational database, and thus there are a few restrictions (described on the pages below).

*   [tastypie](https://github.com/toastdriven/django-tastypie) -> bingo/tastypie/
    *   [dateutil](http://niemeyer.net/python-dateutil) -> bingo/dateutil/
    *   [mimeparse](http://code.google.com/p/mimeparse/) -> bingo/mimeparse.py
*   [djangoappengine](http://www.allbuttonspressed.com/projects/djangoappengine#id1) -> bingo/djangoappengine/ (packages below are all at this link)
    *   django-nonrel -> bingo/django/
    *   djangotoolbox -> bingo/djangotoolbox/
    *   django-dbindexer -> bingo/dbindexer/
*   [gaeunit](http://code.google.com/p/gaeunit/) ->  bingo/gaeunit/

## Build

To build frontend assets:

```
$ cd bingo_board/static/js/
$ python compilejs.py
```

See `compilejs.py`.  Note this is using Google's Closure Compiler.

## Deploy

To deploy without routing traffic:

```
$ gcloud app deploy --project bingo-board-hrd --version 5 --no-promote
```

Then after testing:

```
$ gcloud app deploy --project bingo-board-hrd --version 5 --promote
```
