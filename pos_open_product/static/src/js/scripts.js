odoo.define('pos_open_product.pos_open_product', function (require) {
"use strict";

var gui = require('point_of_sale.gui');
var models = require('point_of_sale.models');
var screens = require('point_of_sale.screens');
var core = require('web.core');
var popups=require('point_of_sale.popups');
var QWeb = core.qweb;
var rpc = require('web.rpc');     

var _t = core._t;
var _super_order_line = models.Orderline.prototype;
models.Orderline = models.Orderline.extend({
    initialize: function() {
        _super_order_line.initialize.apply(this,arguments);
        if (!this.product_name) {
            this.product_name = false;
        }
        
        this.order.save_to_db();
    },
    export_as_JSON: function() {
        var json = _super_order_line.export_as_JSON.apply(this,arguments);
        json.product_name     = this.product_name  ? this.product_name : false;
        //this.order.save_to_db();
        return json;
    },
    init_from_JSON: function(json) {
        var jsonm = _super_order_line.init_from_JSON.apply(this,arguments);
        console.log('----------')
        console.log(json);
        if(json.product_name){
        this.product = _.clone(this.order.pos.db.get_product_by_id(json.product_id));
        this.product['display_name']=json.product_name;
        this.product_name = json.product_name;

    }
    },
    get_product_name: function(){
        return this.product_name;
    },
    set_product_name: function(product) {
        this.product_name = product;
        this.trigger('change',this);
        
    },
});

var OpenproductPopup = popups.extend({
    template: 'OpenproductPopup',
    show: function(options){
        options = options || {};
        this._super(options);

        this.renderElement();
        this.$('input').eq(0).focus();
    },
    click_confirm: function(){
        var product = this.$('input.product_name').val();
        var price = this.$('input.price').val();
        console.log(price);
        if(product == ''  || price == ''){
            alert('Product Name and Price is Required!');

            return;
        }
        
        this.gui.close_popup();
        if( this.options.confirm ){
            this.options.confirm.call(this,product,price);
        
    }
    },
    
});
gui.define_popup({name:'openproductpopup', widget: OpenproductPopup});
var OpenproductButton = screens.ActionButtonWidget.extend({
    template: 'OpenproductButton',
button_click: function(){
    var self=this;
    if(this.pos.config.iface_openproduct_pin){
        this.gui.show_popup('password',{
                'title': _t('Pin ?'),
                confirm: function(pw) {
                    var done = new $.Deferred();
                    rpc.query({ 

                         model: 'res.users', 

                         method: 'check_splittable_security_pin_number', 
                     args: [pw],
                                       
                    }).then(function (value) {
                        //alert(value);
                       if(value){
                               
                        self.show_open_product();

                        }
                    else {
                        alert('Wrong Pin Number!');
                        self.button_click();

                    }
                    });
                   
                },
            });
    }
    else {
        this.show_open_product();
    }

    },
    show_open_product:function(){
        var self=this;
        this.gui.show_popup('openproductpopup',{
                'title':_t('Please enter product item and price'),
                'product':'',
                'price':'',
                
                'confirm': function(product_name,price) {
                    //alert(product);
                    //alert(price);
                    var product = self.pos.db.get_product_by_id(self.pos.config.iface_open_product_id[0]);

                    var pp=_.clone(product);
                    pp['display_name']=product_name;
                    pp['list_price']=price;
                    var selectedOrder = self.pos.get_order(); 
                    console.log(product); 
                    selectedOrder.add_product(pp, {price:price});
                    selectedOrder.get_selected_orderline().set_product_name(product_name);
                    product=null;
                    
                    
                    
                   // console.log(ord);   
                },
            });
    }
});

screens.define_action_button({
    'name': 'openproduct',
    'widget': OpenproductButton,
    'condition': function(){
        return this.pos.config.iface_openproduct && this.pos.config.iface_open_product_id
    },
});

});

