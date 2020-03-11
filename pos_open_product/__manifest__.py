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
    'name': 'Pos Open Product',
    'version': '1.0',
    'category': 'Point Of Sale',
    'sequence': 6,
    'price': 15,
    'license': 'OPL-1',
    'currency': 'EUR',
    'summary': 'Enables to add custom orderlines with price to orders without creating products.',
    'description': """

=======================

This module adds open product features to the Point of Sale:
- POS Config : Option on POS config to enable this feature and to select product to use.
- Custom Product Item Entry: Add items with price to orderline with out creating products.
- Product Display : Display name and price of product will be the one added by user.
- Receipt: Lines displayed on receipt will be the details added by the user, product name and price.
- Data Stored : The display name and price  will be available even if the POS page os refreshed, saved to db.
- Backend Orders : Orderlines on backend will have the name of the product entered on POS

""",
    'depends': ['point_of_sale'],
    'author':'Eman',
    'data': [
        
        'views/pos_config_views.xml',
        'views/pos_order_views.xml',
        
        'views/assets.xml',
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
