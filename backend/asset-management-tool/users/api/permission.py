from rest_framework import permissions
from users.models import Users
from django.shortcuts import get_object_or_404

class IsSuperuser(permissions.BasePermission):
	message = 'Permission Denied'
	def has_permission(self, request, view):
		if request.user.is_superuser:
			return True
		return False

class IsCareTaker(permissions.BasePermission):
	message = 'Permission Denied'
	def has_permission(self, request, view):
		user = get_object_or_404(Users, id = request.user.id)
		if user.is_care_taker:
			return True
		return False

class IsSchemeAdministrator(permissions.BasePermission):
	message = 'Permission Denied'
	def has_permission(self, request, view):
		user = get_object_or_404(Users, id = request.user.id)
		if user.is_administrative_staff:
			return True
		return False

class IsRightAdministratorToUpdateUser(permissions.BasePermission):
	message = 'Permission Denied'
	def has_permission(self, request, view):
		user = get_object_or_404(Users, id = request.user.id)
		if user.is_administrative_staff and user.username == self.kwargs['slug']:
			return True
		return False

class IsAdministrator(permissions.BasePermission):
	message = 'Permission Denied'
	def has_permission(self, request, view):
		user = get_object_or_404(Users, id = request.user.id)
		if user.is_administrative_staff:
			return True
		return False