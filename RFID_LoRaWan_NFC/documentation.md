# Documentation du projet RFID LoRaWan NFC

----

[Documentation constructeur](https://www.rf-track.com/guide/EN/User_guide_LoRaWAN_Reader_NFC_(EN).pdf)

## presentaion du capteur

Le capteur RFID LoRaWan NFC est un capteur de la marque RF-Track. Il permet de lire des tags NFC et RFID et de les envoyer sur un réseau LoRaWan. Il est possible de configurer le capteur pour qu'il envoie les données à une fréquence donnée ou lorsqu'un tag est détecté.

## transmission des données

le capteur envoie les données sur le réseau LoRaWan, pour cela il se connecte a une ou plusieurs passerelles LoRaWan pour transmettre est informations. lorsque l'on analyse un trame qu'il envoye on peut voir différent information tell que l'identifient de la carte scanné, les différent passerel qu'il a porté et donc leur puissance de transmision a la possition du capteur.

## récupération des données

afin de pouvoir récupéré les donnée on peut utilisé un programme python pour récupéré les donnée sur le réseau LoRaWan. pour cela en utilisent différent librairie [paho-mqtt](https://pypi.org/project/paho-mqtt/) qui permet de se connecter a un broker mqtt et de récupéré les donnée. les donnée sur les cartes se situ dans le payload de la trame et sont codé sur base64 il faut donc les décoder pour pouvoir les utilisé.

----

## Copyright &copy; Lucas Simpol Augeray 2023 - All Rights Reserved
