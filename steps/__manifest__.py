# -*- coding: utf-8 -*-
# © 2019 Rimes (<http://www.naolhospital.com>)
# License LGPL-3.0.
{
    "name": "Process Steps Builder",
    "version": "1.0.0.0",
    "author": "Eman",
    "category": "Extra Tools",
    "depends": [
        "base","web","web_widget_flow_chart"
    ],
    "summary":"A module for creating steps for processes and work flows.",
    
    "data": [
        "security/ir.model.access.csv", 
        "views/views.xml",
    ],
    
    'images': ['static/description/banner.png'],
    'license': 'LGPL-3',
    'installable': True,
    'auto_install': False,
    'application': True,
}
