# Generated by Django 3.1.7 on 2021-08-24 07:03

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('maintenance', '0010_auto_20210823_0653'),
    ]

    operations = [
        migrations.AlterField(
            model_name='componentinfo',
            name='designated_person',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='asset_componant_designate', to=settings.AUTH_USER_MODEL, verbose_name='Designated Person'),
        ),
    ]