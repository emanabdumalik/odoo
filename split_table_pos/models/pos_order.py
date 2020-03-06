from odoo import api, fields, models, tools, _


class PosOrder(models.Model):
    _inherit = 'pos.order'

    split_note = fields.Char()
    @api.model
    def _order_fields(self, ui_order):
        order_fields = super(PosOrder, self)._order_fields(ui_order)
        order_fields['split_note'] = ui_order.get('split_note', False)
        return order_fields

