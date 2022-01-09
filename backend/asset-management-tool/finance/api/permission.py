from rest_framework import permissions
from users.models import Users
from django.shortcuts import get_object_or_404
from  ..models import Income, Expenditure
import calendar

class IncomeDeletePermission(permissions.BasePermission):
	''''''
	message = 'Cannot delete this income because transaction has been closed for '
	def has_permission(self, request, view):
		obj = get_object_or_404(Income, id = view.kwargs.get('pk', None))
		if not obj.closed_date:
			return True
		self.message = self.message + calendar.month_name[obj.closed_date.month] + ' ' +str(obj.closed_date.year)
		return False

class ExpenseDeletePermission(permissions.BasePermission):
	message = 'Cannot delete this expenditure because transaction has been closed for '
	def has_permission(self, request, view):
		obj = get_object_or_404(Expenditure, id = view.kwargs.get('pk', None))
		if not obj.closed_date:
			return True
		self.message = self.message + calendar.month_name[obj.closed_date.month] + ' ' +str(obj.closed_date.year)
		return False