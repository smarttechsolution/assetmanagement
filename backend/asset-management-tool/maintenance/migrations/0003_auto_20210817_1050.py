# Generated by Django 3.1.7 on 2021-08-17 10:50

from django.db import migrations, models
import maintenance.models


class Migration(migrations.Migration):

    dependencies = [
        ('maintenance', '0002_auto_20210812_0737'),
    ]

    operations = [
        migrations.RenameField(
            model_name='assetcomponent',
            old_name='next_action_date',
            new_name='next_action',
        ),
        migrations.AddField(
            model_name='assetcomponent',
            name='componant_picture',
            field=models.ImageField(blank=True, null=True, upload_to=maintenance.models.generate_path),
        ),
    ]