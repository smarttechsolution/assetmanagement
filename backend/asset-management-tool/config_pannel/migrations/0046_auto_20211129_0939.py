# Generated by Django 3.1.7 on 2021-11-29 09:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('config_pannel', '0045_auto_20211129_0839'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='otherexpense',
            name='apply_upto',
        ),
        migrations.AddField(
            model_name='otherexpense',
            name='types',
            field=models.CharField(choices=[('Yearly', 'Yearly'), ('Monthly', 'Monthly')], default='Yearly', max_length=50),
            preserve_default=False,
        ),
    ]
