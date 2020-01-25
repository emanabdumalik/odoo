# -*- coding: utf-8 -*-
# See LICENSE file for full copyright and licensing details.


{
    'name': 'POS Category Click Disable and Category Filter',
    'version':'1.0',
    "author":"Eman",
    "license":"LGPL-3",
    'category':'Point of Sale',
    'support':'semirworkuaman@gmail.com',
    'summary': 'POS single category mode with click disable functionality and multiple category mode with predefined categories.',
    'description': """

=======================

This module adds product category filter on Point of Sale:
- Single Category Mode: Allow only one category on a Point of Sale
- Multiple Category: Allow a list of categories on a Point of Sale
- Disable Click: Allows click disabled category on Point of Sale, 
used with Single Category Mode

""",
    'depends': ['point_of_sale'],
    
    'website':'https://github.com/emanabdumalik/odoo/tree/10.0/point_of_sale_categ_filter',
    'images': [
        'images/main_screenshot.png',
    ],    
    'data': [
        
        'views/pos_config_views.xml',
        'views/pos_product_category_filter_templates.xml',
        
    ],
    'qweb': [
        
        'static/src/xml/category_filter.xml',
    ],

    'installable': True,
    'auto_install': False,
}