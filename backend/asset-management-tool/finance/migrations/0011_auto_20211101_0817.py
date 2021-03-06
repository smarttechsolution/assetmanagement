# Generated by Django 3.1.7 on 2021-11-01 08:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0010_auto_20211002_1640'),
    ]

    operations = [
        migrations.AlterField(
            model_name='expenditure',
            name='category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='expenditure_category', to='finance.expensecategory'),
        ),
        migrations.AlterField(
            model_name='income',
            name='category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='income_category', to='finance.incomecategory'),
        ),
    ]
