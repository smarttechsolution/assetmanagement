import datetime
import firebase_admin
from firebase_admin import credentials
from firebase_admin import messaging

cred = credentials.Certificate({
  "type": "service_account",
  "project_id": "assetmanagement-ce2bc",
  "private_key_id": "1b3fa2796c169e6eb9f3c14cb81415944b89f412",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCx1ikeIkdrCYTW\nciPoKviKP2ScXpw5Ebk/0X4P27J+GkY2KqOzx2WbZUNqaafolvy8/nqMHx/1xu+O\nGEMO/3u1BRXZdB/JuLCRrWGUPpemCTrkmToCtiJIJHCt2UCci8cok/hFDUN3ilcU\nOQKvta2qt3xkqkaVnP2rj2mAT57zSdiMIeu72pD18R7u3MD5Bk9O4d9q+XlGjWi4\nhghvZZJIPUIOrTwsQbYdk6lVneCt6Xf7gYPCEiBCJV2rPF2DWH9KZMj2GV+664bM\nTmFqQzU0FFasWKEXMDMxMZa+r8ulhmMkqS+GQNvPm104u/+x9lYcziy8qAvLFazH\n2Wl25JmFAgMBAAECggEAJPc6GU4xT73NC8Fylsw12RDX0kw1R4SYX/xlKpk1l1JR\nVWmUGSbhx0UrmAdJ1IZsF0IDibRfkZhuS7hd2hR/q69YrRifEfCO3V0vqx++qJAD\nGqkCHrWq1xmiBXUjIddJSPVHFl1tMIBEXQsDtK/8Xz/gPtGJNgjJzvtSyA3k4beX\nPCB2mA+3T6weV2gJz4vGI9d4FbQjJO0xJ+GFOrYsrjDIkzrmFPLJvwE6nUQxMemG\nQcmM5LsfwK5puerkpUG36wBgJom9EYp389rajyysVAe0T14kZKugo1ngps2HAp1d\n8a429cjuFKOTf04tpxmxU0Fm9xc6XWl7tkOmiEdpgQKBgQDk5DjonKSKK+OiNkxS\nvhqmOL13LvRb5NYDjLjO9rW6BWBasjEEMowICuNBLna1rcsUW5HH+RQA6yidoshb\nzN78UjIagsEK/I14egvlPrMqvhHZHz3iLT5DwlRRcRqDe0laAd1qjaSFdpNzbmxP\n0Ibm2tpq8BiCnrDV1H4LFl9UgQKBgQDG5gAQ4ciDZtiJFyM9X7Mk/Dw6PzhIp2yN\n2/vO2tXJvMgwm59ZbGx8XfrmsvEOjoHJaTVGZSBfDtwxzujWARdaPjA1GiyHg711\nddnS9zLl1ggyZA8Jv1tqCaxecryHKuJlRwFfCI7PPGv0gQYEoxmhnK0XBELzEaVu\nMbKTwxJzBQKBgHOX0imfGfVxjscX1tmeigTR+NUc0GksGuy1/4r9yu7D0lJbVSfC\ngzd4kCYV2fuMZlfEms27u19vYxag48CAqUgSFp2O1QDAZI2oTSOb043NaWQWRAFa\nSeycUkrC7NnjxDqBYJl0KNcB+Bs+c9KnA8nIUq/YyvgEPlfutSzSQpiBAoGAXnrE\nz0AhOmHxO/W0tKOv+kKi7Vw4hTKaeyxjCdijsyesxII4CIdbZRxTYaDgpvSErEMA\nnobNALqTWEmcCoQMLr7ZsW/UdS7cIV6w8Oih0dGApUcoaY3vg4hCy76e1WpGjqtS\n+GydQc3Gzic3z54WP9Gn2wYYM1RPi++pj00bh20CgYA3Rpn30pv8dLZBvdCzl2Px\nWlRH8h4MwfwGtJj9qPFDrmQN2EM2VS31obQJ7thDUv/qbtTT+4RPYdDs+3lt4HZ2\n9EBs0D3sCsgSvLrO+LgLH2dUSZ8C8AW4btA+VJW0yGhb4jpEWhybABeflWduN4ax\nuWMFzLrCXOgdSwQUjyS4hA==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-8a6v7@assetmanagement-ce2bc.iam.gserviceaccount.com",
  "client_id": "102425585459410909616",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-8a6v7%40assetmanagement-ce2bc.iam.gserviceaccount.com"
})
firebase_admin.initialize_app(cred)

# The topic name can be optionally prefixed with "/topics/".
# topic = 'hello'

def sendPushNotification(ids,created_date,title,message,message_np,title_np, scheme_slug,notf_type):
	"""Send push notification to android app"""
	message = messaging.Message(
	notification=messaging.Notification(
	    title=title,
	    body=message,
	),
	data={
	'id' : str(ids),
	'created_date' : str(created_date),
    'title':title,
    'title_np':title_np,
    'message':message,
    'message_np':message_np,
    'notf_type':notf_type

	},
	android=messaging.AndroidConfig(
	    ttl=datetime.timedelta(seconds=3600),
	    priority='normal',
	    notification=messaging.AndroidNotification(
	        icon='stock_ticker_update',
	        color='#f45342'
	    ),
	),
	apns=messaging.APNSConfig(
	    payload=messaging.APNSPayload(
	        aps=messaging.Aps(badge=42),
	        
	    ),
	),
	topic=scheme_slug,
	)
	# Send a message to the devices subscribed to the provided topic.
	response = messaging.send(message)
	# Response is a message ID string.
	print('Successfully sent message:',response)
