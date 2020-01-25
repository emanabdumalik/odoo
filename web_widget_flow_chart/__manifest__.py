# -*- coding: utf-8 -*-
# © 2019 Rimes (<http://www.sansa-x.com>)
# License LGPL-3.0.
{
    "name": "Flow Chart Widget",
    "version": "1.0.0.0",
    "author": "Eman",
    "category": "Web",
    'support':'semirworkuaman@gmail.com',
    "summary": "This module provides a flow chart designer widget for char fields",
    "website": "https://github.com/emanabdumalik/odoo.git",
    "depends": [
        "base","web",
    ],
    
    "data": [
        "views/assets.xml",
    ],
    "qweb": [
        "static/src/xml/qweb.xml",
    ],
    'images': ['static/description/banner.png'],
    'license': 'LGPL-3',
    'installable': True,
    'auto_install': False,
    'application': False,
}