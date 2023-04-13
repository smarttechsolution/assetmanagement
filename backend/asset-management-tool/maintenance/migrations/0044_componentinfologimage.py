# Generated by Django 3.1.7 on 2022-05-19 15:06

from django.db import migrations, models
import django.db.models.deletion
import maintenance.models


class Migration(migrations.Migration):

    dependencies = [
        ('maintenance', '0043_remove_componentinfolog_component_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='ComponentInfoLogImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('component_image', models.ImageField(blank=True, null=True, upload_to=maintenance.models.assetComponentLogFolder)),
                ('component', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='asset_component_log_image', to='maintenance.componentinfolog')),
            ],
        ),
    ]