# Generated by Django 3.1.7 on 2021-08-27 09:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('config_pannel', '0011_auto_20210826_0758'),
    ]

    operations = [
        migrations.AddField(
            model_name='supplybelts',
            name='name',
            field=models.CharField(default='as', max_length=100),
            preserve_default=False,
        ),
    ]
