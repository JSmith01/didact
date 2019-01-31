Didact training repo
====================

This repo tries to follow [Didact series](https://engineering.hexacta.com/didact-learning-how-react-works-by-building-it-from-scratch-51007984e5c5) published on Medium. Implementation is close to the original one, but sometimes it goes a step further towards original React API.

Now it uses quite a recent ES standard without packager so it requires a modern browser to be run.

Despite this sources should be transpiled to be able to use JSX syntax:
```
$ npm run build
```

This pseudo-React misses debug tools and hot reload, but it's quite compact to be debugged through usual browser debugger.
