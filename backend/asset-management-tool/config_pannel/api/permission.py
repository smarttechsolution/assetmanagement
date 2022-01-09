from rest_framework import permissions
from users.models import Users
from django.shortcuts import get_object_or_404

class IsSuperuser(permissions.BasePermission):
	'''Return true if user is superuser'''
	message = 'Permission Denied'
	def has_permission(self, request, view):
		user = get_object_or_404(Users, id = request.user.id)
		if user.is_superuser:
			return True
		return False

