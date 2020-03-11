odoo.define('pos_session_close_pin.pos_session_close_pin', function (require) {
"use strict";

var core = require('web.core');
var Model = require('web.Model');
var Widget = require('web.Widget');
var Session = require('web.session');
var BarcodeHandlerMixin = require('barcodes.BarcodeHandlerMixin');
var common = require('web.form_common');
    var widget = require('web.form_widgets');
var formats = require('web.formats');

var QWeb = core.qweb;
var _t = core._t;

var WebClient = require('web.WebClient');
var session = require('web.session');   
var bus = require('bus.bus') 
var PopupWidget = Widget.extend({
    template: 'PopupWidget',
    init: function(parent, args) {
        this._super(parent, args);
        this.options = {};
    },
    events: {
        'click .button.cancel':  'click_cancel',
        'click .button.confirm': 'click_confirm',
        'click .selection-item': 'click_item',
        'click .input-button':   'click_numpad',
        'click .mode-button':    'click_numpad',
    },

    // show the popup !  
    show: function(options){
        if(this.$el){
            this.$el.removeClass('oe_hidden');
        }
        
        if (typeof options === 'string') {
            this.options = {title: options};
        } else {
            this.options = options || {};
        }

        this.renderElement();

        // popups block the barcode reader ... 
        
    },

    // called before hide, when a popup is closed.
    // extend this if you want a custom action when the 
    // popup is closed.
    close: function(){
       
    },

    // hides the popup. keep in mind that this is called in 
    // the initialization pass of the pos instantiation, 
    // so you don't want to do anything fancy in here
    hide: function(){
        if (this.$el) {
            this.$el.addClass('oe_hidden');
        }
    },

    // what happens when we click cancel
    // ( it should close the popup and do nothing )
    click_cancel: function(){
      console.log(this.$el);
       this.$el.remove();
        if (this.options.cancel) {
            this.options.cancel.call(this);
        }
    },

    // what happens when we confirm the action
    click_confirm: function(){
        
        if (this.options.confirm) {
            this.options.confirm.call(this);
        }
    },

    // Since Widget does not support extending the events declaration
    // we declared them all in the top class.
    click_item: function(){},
    click_numad: function(){},
});
var PasswordPopupWidget = PopupWidget.extend({
    template: 'NumberPopupWidget',
    show: function(options){
        options = options || {};
        this._super(options);

        this.inputbuffer = '' + (options.value   || '');
        this.decimal_separator = _t.database.parameters.decimal_point;
        this.renderElement();
        this.firstinput = true;
    },
    renderElement: function(){
        this._super();
        this.$('.popup').addClass('popup-password');
    },
    numpad_input: function(buffer, input, options) { 
        var newbuf  = buffer.slice(0);
        options = options || {};
        var newbuf_float  = formats.parse_value(newbuf, {type: "float"}, 0);
        var decimal_point = _t.database.parameters.decimal_point;

        if (input === decimal_point) {
            if (options.firstinput) {
                newbuf = "0.";
            }else if (!newbuf.length || newbuf === '-') {
                newbuf += "0.";
            } else if (newbuf.indexOf(decimal_point) < 0){
                newbuf = newbuf + decimal_point;
            }
        } else if (input === 'CLEAR') {
            newbuf = ""; 
        } else if (input === 'BACKSPACE') { 
            newbuf = newbuf.substring(0,newbuf.length - 1);
        } else if (input === '+') {
            if ( newbuf[0] === '-' ) {
                newbuf = newbuf.substring(1,newbuf.length);
            }
        } else if (input === '-') {
            if ( newbuf[0] === '-' ) {
                newbuf = newbuf.substring(1,newbuf.length);
            } else {
                newbuf = '-' + newbuf;
            }
        } else if (input[0] === '+' && !isNaN(parseFloat(input))) {
            newbuf =  parseFloat(input);
        } else if (!isNaN(parseInt(input))) {
            if (options.firstinput) {
                newbuf = '' + input;
            } else {
                newbuf += input;
            }
        }

        // End of input buffer at 12 characters.
        if (newbuf.length > buffer.length && newbuf.length > 12) {
            
            return buffer.slice(0);
        }

        return newbuf;
    },
    click_numpad: function(event){
        var newbuf = this.numpad_input(
            this.inputbuffer, 
            $(event.target).data('action'), 
            {'firstinput': this.firstinput});

        this.firstinput = (newbuf.length === 0);
        
        if (newbuf !== this.inputbuffer) {
            this.inputbuffer = newbuf;
            this.$('.value').text(this.inputbuffer);
        }
        var $value = this.$('.value');
        $value.text($value.text().replace(/./g, '•'));
    },
    click_confirm: function(){
        this.hide();
        if( this.options.confirm ){
            this.options.confirm.call(this,this.inputbuffer);
        }
    },
});

var SessionValidateButton = common.FormWidget.extend({
    template: 'SessionValidateButton',
     

   
   
    show_password_window:function(){
    	var self=this;
    	this.popup = new PasswordPopupWidget(this,{});
    	$('body').append(this.popup.$el);   
    	this.popup.show({
    		'title': _t('PIN ?'),
            confirm: function(pw){
            	console.log(self);
            	var res_user = new Model('res.users');
                    res_user.call("check_session_security_pin_number", [pw]).then(function (value) {
                        //alert(value);
                        if(value){
                        	self.popup.$el.remove();
                        	$('.proceed_with_close_session').click();
					
                           // alert(nm);
                        } 

                        else{
                            alert('Incorrect Pin Number');
                        }
                    });
            	

            }
    	})
    	//console.log(pop);
    


    },
    renderElement:function(){
    	var self=this;
    	this._super();

    	this.$el.click(function(){
    		self.show_password_window();
    	})
    }



    })
core.form_custom_registry.add('sessionvalidate', SessionValidateButton);
return {
  SessionValidateButton:SessionValidateButton,



 
};
});

