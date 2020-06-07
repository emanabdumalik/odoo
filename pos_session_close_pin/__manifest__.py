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
    'name': 'POS Session Validate with PIN',
    'version': '1.0',
    'category': 'Point of Sale',
    'sequence': 6,
    'license': 'OPL-1',
    'summary': 'Request PIN on session close and validate',
    'description': """

=======================
Adds a current session button on pos config dashboard and requests users pin on session
close and validate.

""",
    'depends': ['point_of_sale'],
    'author':'Semir Worku',
    'data': [
        
        'views/pos_config_views.xml',
        'views/pos_session_views.xml',
        
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
