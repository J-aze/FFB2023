import base64

def decodage_partition(payload_msg) :

    # convertion de la base 64 a la base 16
    decoded_val = base64.b64decode(payload_msg)
    entryid = decoded_val.hex()
   
    # découpe de la chaine hexa

    ## inition des variables
    tailles_morceaux = [2, 8, 2,16]
    morceaux = []
    indice_debut = 0

    for taille in tailles_morceaux:
        morceau = entryid[indice_debut:indice_debut+taille]
        morceaux.append(morceau)
        indice_debut += taille

    print (morceaux)
    return morceaux