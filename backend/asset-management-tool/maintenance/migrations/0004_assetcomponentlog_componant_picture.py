# Generated by Django 3.1.7 on 2021-08-17 10:57

from django.db import migrations, models
import maintenance.models


class Migration(migrations.Migration):

    dependencies = [
        ('maintenance', '0003_auto_20210817_1050'),
    ]

    operations = [
        migrations.AddField(
            model_name='assetcomponentlog',
            name='componant_picture',
            field=models.ImageField(blank=True, null=True, upload_to=maintenance.models.assetComponentLogFolder),
        ),
    ]
