import base64

def decodage_partition(payload_msg) :

    # recuperation des données du payload et conversion en hexa
    decoded_val = base64.b64decode(payload_msg)
    entryid = decoded_val.hex()

    # découpe de la chaine hexa
    #10 10 14
    header=entryid[0:11]
    status=entryid[11:20]
    end=entryid[20:]
    
    # affichage de la trame payload décodée et découpée
    print('head',header)
    print('status',status)
    print('end',end)
    
    
    return 0
