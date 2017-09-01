## Assignment Discovery

This is a "quick" (ha) assignment to make an HTML5 video player via YouTube APIs.

### Installation

Should be pretty simple -

```
git clone https://github.com/numonium/assignment-discovery.git
cd ./assignment-discovery && npm install
```

To start -

```npm start```

* Listens on port `3000`

For dev, you'll also need to set up the SCSS watcher (probably in a new tab/window) -

```npm run watch-css```

### TODO / Wish-List:

While I've done my best efforts to meet all the requirements, there are a few things I'd like to get to if time allotted:

- Video Loading
  - Better video loading (with loaders, spinners, and stuff)
    - There currently is a bug that says "no videos found" while fetching data, should be changed to "loading" and differentiate between "loading" and "error" states.
    - Scroll to top when video or category loaded
  - Better video sizing based on viewport size + change
    - (right now, the video breaks @ `720px` and changes the player width to `100%` if lower, but not the height since aspect ratios may differ between videos)
  - *Lazy loading* on scroll
    - basically we'd have to attach an event handler to the window's `scroll` event that would call `App.search() -> Redux/actions/yt_search()` and load more videos into `this.props.videos`
      - incrementing a counter each time is fired, maxes out at `3` lazy loads
  - Homepage
    - Query featured categories for random videos
      - Didn't include because didn't have enough time to craft a solution that doesn't take forever to load (better random seed data)
      - Do we want to loop through each category and make a request to the API for a list of videos, then pick a random one?
  - Higher-Order Component for Data Transfer
    - I'd like to further abstract the data layer using a higher-order component to encapsulate data returned from Redux... however part of me thinks it would be unnecessary / redundant since Redux is already managing data flows in and out of the component.
    - I could see this as an "either-or" but not both.
    - Wondering about other ways to implement an HOC on this "small" project
  - Better design and eye-candy :)
    - Combine "player" and "list" views for a more YouTube-like layout
  - Oh, and better unit tests!
