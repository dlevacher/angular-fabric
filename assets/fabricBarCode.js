
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

    if (!global.JsBarcode) {
        fabric.warn('JsBarcode is not defined.');
        return;
    }

    if (global.fabric.BarCode) {
        fabric.warn('fabric.BarCode is already defined.');
        return;
    }

    /**
    * BarCode class
    * @class fabric.BarCode
    * @extends fabric.Image
    * @see {@link fabric.BarCode#initialize} for constructor definition
    */
    fabric.BarCode = fabric.util.createClass(fabric.Image, /** @lends fabric.BarCode.prototype */ {

        /**
         * Type of an object
         * @type String
         * @default
         */
         type: 'BarCode',

        /**
         * @type String
         * @default
         */
         text: '',

        /**
         * private
         * @type HTMLElement
         */
         _el: null,

        /**
         * private
         * @type String
         */
         _lastText: null,

        /**
         * private
         * @type Object
         */
         _lastOptions: null,

        /**
         * Constructor
         * @param {HTMLImageElement | String} element Image element
         * @param {Object} [options] Options object
         * @return {fabric.BarCode} thisArg
         */
         initialize: function(text, options) {
            var options = extend({ 
                // scaleX: 0.5,
                // scaleY: 0.5,
                format: 'auto',
                fontFamily: 'OCRB',
                displayValue: false
            }, options);
            this.setOptions(options);

            this.text = text || '';
            this._lastText = this.text;
            this._lastOptions = this.getOptions();
            this._el = document.createElement("canvas");
            this._updateBarCode();
            // var base64Data = this._el.toDataURL('image/jpg');

            this.callSuper('initialize', this._el, options);
        },

        getText: function() {
            return ((this.format||'') == 'CODE128' ? '\xCF' : '') + (this.text);
        },

        getOptions: function() {
            return ({
                format: this.format||'auto',
                font: this.fontFamily||'OCRB',
                lineColor: this.fill,
                displayValue: this.displayValue
            });
        },

        /**
         * Returns object representation of an instance
         * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
         * @return {Object} Object representation of an instance
         */
         toObject: function(propertiesToInclude) {
            return extend(this.callSuper('toObject', propertiesToInclude), {
                text: this.text,
                format: this.format,
                fontFamily: this.fontFamily,
                displayValue: this.displayValue
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
                this._updateBarCode();
            this.callSuper('_render', ctx, noTransform);
        },
        /**
        * @private, needed to check if image needs redraw
        */
        _needsUpdate: function() {
            return (this.text !== this._lastText) || (JSON.stringify(this.getOptions()) !== JSON.stringify(this._last));
        },

        _updateBarCode: function() {
            var text = this.getText();
            if (text.length && text.length > 0) {
                try {
                    JsBarcode(this._el, this.getText(), this.getOptions());
                }
                catch (e) {
                    console.error(e);
                }
            }
            else {
                fabric.warn('Invalid text');
            }
            this._lastText = this.text;
            this._lastOptions = this.getOptions();
        },

        setText: function(text) {
            this.text = text;
        }
    });

    /**
    * Creates an instance of fabric.BarCode from its object representation
    * @static
    * @param {Object} object Object to create an instance from
    * @param {Function} [callback] Callback to invoke when an image instance is created
    */
    fabric.BarCode.fromObject = function(object, callback) {
        return new fabric.BarCode(object.text, clone(object));
    };
})(typeof exports !== 'undefined' ? exports : this);

