define(["alertify", "validate", "element", "transition"], function (Alertify, validate, element, transition) {
    "use strict";

    var Log,
        onAnimationEnd,
        remove,
        startTimer,
        prefix  = Alertify._prefix + "-log",
        clsHide = prefix + " is-" + prefix + "-hidden";

    /**
     * Log Method
     *
     * @param {Object} parent HTML DOM to insert log message into
     * @param {String} type   Log type
     * @param {String} msg    Log message
     * @param {Number} delay  [Optional] Delay in ms
     */
    Log = function (parent, type, msg, delay) {
        if (!validate.isObject(parent) ||
            !validate.isString(type) ||
            !validate.isString(msg) ||
            !validate.isNumber(delay, true)) {
            throw new Error(validate.messages.invalidArguments);
        }

        this.delay  = (typeof delay !== "undefined") ? delay : 5000;
        this.msg    = msg;
        this.parent = parent;
        this.type   = type;
        this.create();
        this.show();
    };

    /**
     * Animation End
     * Handle CSS transition end
     *
     * @return {undefined}
     */
    onAnimationEnd = function () {
        if (typeof this.el !== "undefined") {
            remove.call(this);
        }
    };

    /**
     * Remove
     * Remove the element from the DOM
     *
     * @return {undefined}
     */
    remove = function () {
        this.parent.removeChild(this.el);
        delete this.el;
    };

    /**
     * StartTimer
     *
     * @return {undefined}
     */
    startTimer = function () {
        var that = this;
        if (this.delay !== 0) {
            setTimeout(function () {
                that.close();
            }, this.delay);
        }
    };

    /**
     * Close
     * Prepare the log element to be removed.
     * Set an event listener for transition complete
     * or call the remove directly
     *
     * @return {undefined}
     */
    Log.prototype.close = function () {
        console.log('close fired');
        var that = this;
        if (typeof this.el !== "undefined" && this.el.parentNode === this.parent) {

            this.fn = function() {
                onAnimationEnd.call(that);
            };
            TweenLite.to(this.el, speeds.fast/1000, {css:{
                    opacity : 0,
                    right   : this.el.offsetWidth*-1
                },
                onComplete : this.fn,
                ease : easing.gsap.origin
            })

        }
    };

    /**
     * Create
     * Create a new log element and
     * append it to the parent
     *
     * @return {undefined}
     */
    Log.prototype.create = function () {
        if (typeof this.el === "undefined") {
            var el = element.create("article", {
                classes: clsHide + " " + prefix + "-" + this.type
            });
            el.innerHTML = this.msg;
            this.parent.appendChild(el);
            element.ready(el);
            this.el = el;
        }
    };

    /**
     * Show
     * Show new log element and bind click listener
     *
     * @return {undefined}
     */
    Log.prototype.show = function () {
        var that = this;
        if (typeof this.el === "undefined") {
            return;
        }
        Alertify.on(this.el, "click", function () {
            that.close();
        });

        console.log(speeds);
        TweenLite.to(this.el, speeds.fast/1000, {
            css:{
                opacity : 1,
                right   : 0
            },
            ease : easing.gsap.snap
        });

        //this.el.className = clsShow + " " + prefix + "-" + this.type;
        startTimer.call(this);
    };

    return Log;
});