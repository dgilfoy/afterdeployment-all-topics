webpackJsonp([4],{"./src/components/Video.tsx":function(e,t,r){"use strict";var o=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])};return function(t,r){function o(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(o.prototype=r.prototype,new o)}}();Object.defineProperty(t,"__esModule",{value:!0});var n=r("./node_modules/react/react.js"),s=r("./src/components/commonStyles.ts"),i=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return o(t,e),t.prototype.componentWillMount=function(){var e=this.props.video;this.props.appBarTitle&&this.props.appBarTitle(e.title)},t.prototype.render=function(){var e=this.props,t=e.video,r=e.screenWidth,o=n.createElement("video",{width:r,src:t.src,poster:t.img,controls:!0},"Sorry, your browser doesn't support embedded videos."),i=o;return n.createElement("div",{style:s.flexParentRowCenterStyle},n.createElement("div",{style:s.flexRowItemStyle},i))},t}(n.Component);i.defaultProps={screenWidth:400},t.default=i},"./src/containers/Video.tsx":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=r("./src/components/Video.tsx"),n=r("./src/res/videos.ts"),s=r("./src/res/modules.ts"),i=r("./node_modules/react-redux/es/index.js"),c=function(e,t){var r=s.modules.filter(function(e){return parseInt(t.params.mid)===e.id}),o=r[0].slug;return{video:n[o+"Vids"][t.params.id],screenWidth:e.device.width<400?e.device.width:400}},d=function(e){return{}};t.default=i.connect(c,d)(o.default)}});