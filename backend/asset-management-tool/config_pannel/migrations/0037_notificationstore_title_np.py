# Generated by Django 3.1.7 on 2021-10-27 05:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('config_pannel', '0036_notificationstore_message_np'),
    ]

    operations = [
        migrations.AddField(
            model_name='notificationstore',
            name='title_np',
            field=models.CharField(default='test', max_length=50),
            preserve_default=False,
        ),
    ]