# -*- coding: utf-8 -*-
# See LICENSE file for full copyright and licensing details.


{
    'name': 'POS Product Category Filter',
    'version': '1.0',
    'author':'Eman Abdulmalik',
    'category': 'Point of Sale',
    'support':'semirworkuaman@gmail.com',
    'summary': 'Product Category Filter for Point of Sale',
    'description': """

=======================

This module adds product category filter on Point of Sale:
- Single Category Mode: Allow only one category on a Point of Sale
- Multiple Category: Allow a list of categories on a Point of Sale
- Disable Click: Allows click disabled category on Point of Sale, 
used with Single Category Mode

""",
    'depends': ['point_of_sale'],
    'price': '9.5',
    'currency':'EUR',
    'website':'https://github.com/emanabdumalik/pos_product_category_filter#10.0',
    'images': [
        'static/description/pos_product_category_filter_banner.jpg',
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
