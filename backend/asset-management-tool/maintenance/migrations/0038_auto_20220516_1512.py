# Generated by Django 3.1.7 on 2022-05-16 09:27

from django.db import migrations, models
import maintenance.models


class Migration(migrations.Migration):

    dependencies = [
        ('maintenance', '0037_auto_20220511_1545'),
    ]

    operations = [
        migrations.AlterField(
            model_name='componentinfolog',
            name='componant_picture',
            field=models.ImageField(blank=True, null=True, upload_to=maintenance.models.generate_path),
        ),
    ]
