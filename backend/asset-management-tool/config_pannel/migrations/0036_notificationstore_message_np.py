# Generated by Django 3.1.7 on 2021-10-26 05:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('config_pannel', '0035_notificationstore'),
    ]

    operations = [
        migrations.AddField(
            model_name='notificationstore',
            name='message_np',
            field=models.CharField(default='test', max_length=250),
            preserve_default=False,
        ),
    ]
