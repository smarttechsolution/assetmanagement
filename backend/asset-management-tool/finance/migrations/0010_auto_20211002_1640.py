# Generated by Django 3.1.7 on 2021-10-02 16:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0009_auto_20211002_1553'),
    ]

    operations = [
        migrations.AlterField(
            model_name='expenditure',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='income',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
