var Ripple = {
  bind: function(el, binding) {
    // Default values.
    var props = {
      event: "mousedown",
      transition: 600
    };

    setProps(Object.keys(binding.modifiers), props);

    el.addEventListener(props.event, function(event) {
      rippler(event, el, binding.value);
      event.preventDefault();
    });

    var bg = binding.value || Ripple.color || "rgba(0, 0, 0, 0.35)";
    if (binding.arg === "light") bg = "rgba(255, 255, 255, 0.35)";
    if (binding.arg === "dark") bg = "rgba(0, 0, 0, 0.35)";

    if (Ripple.colors && binding.arg) {
      if (Ripple.colors[binding.arg]) bg = Ripple.colors[binding.arg];
    }

    if (Ripple.class) {
      el.classList.add(Ripple.class);
    }

    var zIndex = Ripple.zIndex || "9999";

    function rippler(event, el) {
      // Get border to avoid offsetting on ripple container position
      var target = el;
      var targetBorder = parseInt(
        getComputedStyle(target).borderWidth.replace("px", "")
      );

      // Get necessary variables
      var rect = target.getBoundingClientRect();

      var left = rect.left;

      var top = rect.top;

      var width = target.offsetWidth;

      var height = target.offsetHeight;

      var dx = event.clientX - left;

      var dy = event.clientY - top;

      var maxX = Math.max(dx, width - dx);

      var maxY = Math.max(dy, height - dy);

      var style = window.getComputedStyle(target);

      var radius = Math.sqrt(maxX * maxX + maxY * maxY);

      var border = targetBorder > 0 ? targetBorder : 0;

      // Create the ripple and its container
      var ripple = document.createElement("div");
      var rippleContainer = document.createElement("div");
      rippleContainer.className = "ripple-container";
      ripple.className = "ripple";

      // Styles for ripple
      ripple.style.marginTop = "0px";
      ripple.style.marginLeft = "0px";
      ripple.style.width = "1px";
      ripple.style.height = "1px";
      ripple.style.transition =
        "all " + props.transition + "ms cubic-bezier(0.4, 0, 0.2, 1)";
      ripple.style.borderRadius = "50%";
      ripple.style.pointerEvents = "none";
      ripple.style.position = "relative";
      ripple.style.zIndex = zIndex;
      ripple.style.backgroundColor = bg;

      // Styles for rippleContainer
      rippleContainer.style.position = "absolute";
      // rippleContainer.style.left = 0 - border + "px";
      // rippleContainer.style.top = 0 - border + "px";
      rippleContainer.style.left = 0;
      rippleContainer.style.top = 0;
      rippleContainer.style.right = 0;
      rippleContainer.style.bottom = 0;
      // rippleContainer.style.height = "0";
      // rippleContainer.style.width = "0";
      rippleContainer.style.pointerEvents = "none";
      rippleContainer.style.overflow = "hidden";

      // Store target position to change it after
      var storedTargetPosition =
        target.style.position.length > 0
          ? target.style.position
          : getComputedStyle(target).position;
      // Change target position to relative to guarantee ripples correct positioning
      if (storedTargetPosition !== "relative") {
        target.style.position = "relative";
      }

      rippleContainer.appendChild(ripple);
      target.appendChild(rippleContainer);

      // ripple.style.marginLeft = dx + 'px'
      // ripple.style.marginTop = dy + 'px'
      ripple.style.transform = `translate(${dx}px,${dy}px) scale(1)`;

      // rippleContainer.style.width = width + "px";
      // rippleContainer.style.height = height + "px";
      rippleContainer.style.borderTopLeftRadius = style.borderTopLeftRadius;
      rippleContainer.style.borderTopRightRadius = style.borderTopRightRadius;
      rippleContainer.style.borderBottomLeftRadius =
        style.borderBottomLeftRadius;
      rippleContainer.style.borderBottomRightRadius =
        style.borderBottomRightRadius;

      rippleContainer.style.direction = "ltr";

      setTimeout(function() {
        // ripple.style.width = radius * 2 + 'px'
        // ripple.style.height = radius * 2 + 'px'
        // ripple.style.transform = `scale(${radius * 2})`
        // ripple.style.marginLeft = dx - radius + 'px'
        // ripple.style.marginTop = dy - radius + 'px'
        ripple.style.transform = `translate(${dx}px,${dy}px) scale(${radius *
          2})`;
      }, 0);

      function clearRipple() {
        setTimeout(function() {
          ripple.style.backgroundColor = "rgba(0, 0, 0, 0)";
        }, 250);

        // Timeout set to get a smooth removal of the ripple
        setTimeout(function() {
          rippleContainer.parentNode.removeChild(rippleContainer);
        }, 850);

        el.removeEventListener("mouseup", clearRipple, false);
        el.removeEventListener("mouseleave", clearRipple, false);
        el.removeEventListener("touchend", clearRipple, false);
        el.removeEventListener("touchcancel", clearRipple, false);
        el.removeEventListener("dragstart", clearRipple, false);

        // After removing event set position to target to it's original one
        // Timeout it's needed to avoid jerky effect of ripple jumping out parent target
        setTimeout(function() {
          var clearPosition = true;
          for (var i = 0; i < target.childNodes.length; i++) {
            if (target.childNodes[i].className === "ripple-container") {
              clearPosition = false;
            }
          }

          if (clearPosition) {
            if (storedTargetPosition !== "static") {
              target.style.position = storedTargetPosition;
            } else {
              target.style.position = "";
            }
          }
        }, props.transition + 250);
      }

      if (event.type === "mousedown") {
        el.addEventListener("mouseup", clearRipple, false);
        el.addEventListener("mouseleave", clearRipple, false);
        el.addEventListener("touchend", clearRipple, false);
        el.addEventListener("touchcancel", clearRipple, false);
        el.addEventListener("dragstart", clearRipple, false);
      } else {
        clearRipple();
      }
    }
  }
};

function setProps(modifiers, props) {
  modifiers.forEach(function(item) {
    if (isNaN(Number(item))) props.event = item;
    else props.transition = item;
  });
}

export default Ripple;
