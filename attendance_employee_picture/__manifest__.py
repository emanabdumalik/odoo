# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.


{
    'name': 'Employee Picture on Attendance',
    'version': '1.0',
    'category': 'Human Resource',
    'sequence': 6,
    'summary': 'Show Employee Picture on Attendance',
    'description':"""
        Show Employee Picture on Attendance
    """,
    'depends': ['base','hr_attendance'],
    'website': 'https://www.naolhospital.com',
    'author':'Eman ',
    'data': [
        
        
        'views/assets.xml'
        
    ],
    'qweb': [
        'static/src/xml/*.xml'
        
    ],
    'demo': [
        
    ],
    'images': ['static/description/banner.png'],
    'license': 'LGPL-3',
    'installable': True,
    'auto_install': False,
}
