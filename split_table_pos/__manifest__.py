# -*- coding: utf-8 -*-
#################################################################################
# Author      : Eman. (<www.odoourl.com>)
# Copyright(c): 2012-Present Rimes App Pvt. Ltd.
# All Rights Reserved.
#
# This program is copyright property of the author mentioned above.
# You can`t redistribute it and/or modify it.
#
#################################################################################


{
    'name': 'Pos Split Table',
    'version': '1.0',
    'category': 'Point of Sale',
    'sequence': 6,
    'price': 30,
    'currency': 'EUR',
    'license': 'OPL-1',
    'summary': 'Enables splitting order to different tables.',
    'description': """

=======================

This module enables splitting of order  to different tables
- POS Config : Option on POS config to enable this feature.
- Interface: Uses the native tables and split bill screens.
- Select Orderlibes : Allows selecting of individual orderlines to be transfered to another table.
- Creates Order : Creates a new order on the desired table with selected orderlines.
- Pin Support : Option on POS config to request pin on splitting table orders.
- Note : Option on POS config to request note during table splitting, note displayed on both OrderWidget on front end and POS orders on backend.
- Quantity Split : Enables quantity split on orderlines.

""",
    'depends': ['point_of_sale','pos_restaurant'],
    'author':'Eman',
    'data': [
         
        'views/pos_config_views.xml',
        'views/assets.xml',
        'views/pos_order_views.xml',
    ],
    'qweb': [
        'static/src/xml/templates.xml',
        
    ],
    'demo': [
        
    ],
    'images': ['static/description/banner.png'],
    'installable': True,
    'auto_install': False,
}
