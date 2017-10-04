
(function(global) {

    'use strict';

    var extend = fabric.util.object.extend,
        clone = fabric.util.object.clone;

    if (!global.fabric) {
        global.fabric = { };
    }

    if (!global.fabric.Image) {
        fabric.warn('fabric.Image is not defined.');
        return;
    }

    if (global.fabric.QRCode) {
        fabric.warn('fabric.QRCode is already defined.');
        return;
    }

    /**
    * QRCode class
    * @class fabric.QRCode
    * @extends fabric.Image
    * @see {@link fabric.QRCode#initialize} for constructor definition
    */
    fabric.QRCode = fabric.util.createClass(fabric.Image, /** @lends fabric.QRCode.prototype */ {

        /**
         * Type of an object
         * @type String
         * @default
         */
         type: 'QRCode',

        /**
         * @type String
         * @default
         */
         text: '',

        /**
         * @see https://davidshimjs.github.io/qrcodejs/
         * @type String
         * @default QRCode.CorrectLevel.H
         */
         correctLevel : QRCode.CorrectLevel.H||'',

        /**
         * private
         * @type HTMLElement
         */
         _el: null,

        /**
         * private
         * @type QRCode
         */
         _qrcode: null,

        /**
         * private
         * @type fabric.Image
         */
         _img: null,

        /**
         * private
         * @type String
         */
         _lastText: null,

        /**
         * Constructor
         * @param {HTMLImageElement | String} element Image element
         * @param {Object} [options] Options object
         * @return {fabric.QRCode} thisArg
         */
         initialize: function(text, options) {
            var options = extend({ 
                scaleX: 0.5,
                scaleY: 0.5
            }, options);

            this.text = text || '';
            this._lastText = this.text;
            this._el = document.createElement("div");
            this._qrcode = new QRCode(this._el, {
                correctLevel: options.correctLevel || this.correctLevel
            });
            this._qrcode.makeCode(this.text);

            this.callSuper('initialize', this._el.querySelector('canvas'), options);
        },

        /**
         * Returns object representation of an instance
         * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
         * @return {Object} Object representation of an instance
         */
         toObject: function(propertiesToInclude) {
            return extend(this.callSuper('toObject', propertiesToInclude), {
                text: this.text,
                correctLevel: this.correctLevel
            });
        },

        /**
        * Returns a clone of an instance
        * @param {Function} callback Callback is invoked with a clone as a first argument
        * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
        */
        clone: function(callback, propertiesToInclude) {
            this.constructor.fromObject(this.toObject(propertiesToInclude), callback);
        },
        /**
        * @private
        * @param {CanvasRenderingContext2D} ctx Context to render on
        */
        _render: function(ctx, noTransform) {
            if (this._needsUpdate())
                this._updateQRCode();
            this.callSuper('_render', ctx, noTransform);
        },
        /**
        * @private, needed to check if image needs redraw
        */
        _needsUpdate: function() {
            return (this.text !== this._lastText);
        },

        _updateQRCode: function() {
            this._qrcode.clear();
            this._qrcode.makeCode(this.text);
            this._lastText = this.text;
            this.setElement(this._el.querySelector('canvas'));
        },

        setText: function(text) {
            this.text = text;
        }
    });

    /**
    * Creates an instance of fabric.QRCode from its object representation
    * @static
    * @param {Object} object Object to create an instance from
    * @param {Function} [callback] Callback to invoke when an image instance is created
    */
    fabric.QRCode.fromObject = function(object, callback) {
        return new fabric.QRCode(object.text, clone(object));
    };
})(typeof exports !== 'undefined' ? exports : this);

