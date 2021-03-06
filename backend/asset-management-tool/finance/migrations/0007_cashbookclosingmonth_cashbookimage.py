# Generated by Django 3.1.7 on 2021-09-03 10:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('config_pannel', '0015_auto_20210903_0534'),
        ('finance', '0006_auto_20210825_0643'),
    ]

    operations = [
        migrations.CreateModel(
            name='CashBookClosingMonth',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('water_scheme', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cash_book_image', to='config_pannel.waterscheme')),
            ],
        ),
        migrations.CreateModel(
            name='CashBookImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, null=True, upload_to='')),
                ('closing_date', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cashbook_image', to='finance.cashbookclosingmonth')),
            ],
            options={
                'verbose_name': 'Cash Book Image',
                'verbose_name_plural': 'Cash Book Images',
            },
        ),
    ]
