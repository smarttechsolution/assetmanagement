# Generated by Django 3.1.7 on 2021-08-25 06:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('config_pannel', '0004_auto_20210824_0753'),
    ]

    operations = [
        migrations.AlterField(
            model_name='watertestresultparamters',
            name='test_result',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='test_result_parameter', to='config_pannel.watertestresults'),
        ),
    ]
