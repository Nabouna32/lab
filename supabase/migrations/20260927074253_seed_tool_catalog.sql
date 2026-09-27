insert into public.tool_catalog
  (id, slug, icon, complexity, lifecycle, access, contributor_type)
values
  ('pourcentage','pourcentage','📊','small','published','anonymous','internal'),
  ('reduction','reduction','🏷️','small','published','anonymous','internal'),
  ('tva','tva','💶','small','published','anonymous','internal'),
  ('regle-de-trois','regle-de-trois','⚖️','small','published','anonymous','internal'),
  ('age','age','🎂','small','published','anonymous','internal'),
  ('duree','duree','⏱️','small','published','anonymous','internal'),
  ('vitesse-telechargement','vitesse-telechargement','🚀','small','published','anonymous','internal'),
  ('temps-telechargement','temps-telechargement','⏳','small','published','anonymous','internal'),
  ('taille-fichier','taille-fichier','💾','advanced','published','anonymous','internal'),
  ('convertisseur-taille','convertisseur-taille','🔄','small','published','anonymous','internal'),
  ('mots-caracteres','mots-caracteres','🔤','small','published','anonymous','internal'),
  ('bitrate-video','bitrate-video','🎬','advanced','draft','anonymous','internal');

insert into public.tool_translations (tool_id,locale,name,description,seo_title,seo_description) values
('pourcentage','fr','Calculateur de pourcentage','Calculez facilement un pourcentage, une évolution ou une différence.','Calculateur de pourcentage gratuit | Utiluna','Calculez facilement un pourcentage, une augmentation ou une diminution en pourcentage grâce à notre calculateur gratuit.'),
('pourcentage','en','Percentage Calculator','Easily calculate a percentage, change, or difference.','Free Percentage Calculator | Utiluna','Easily calculate percentages, increases, and decreases with our free percentage calculator.'),
('reduction','fr','Calculateur de réduction','Calculez le prix après une réduction et le montant économisé.','Calculateur de réduction gratuit | Utiluna','Calculez le prix après une réduction et le montant économisé grâce à notre calculateur gratuit.'),
('reduction','en','Discount Calculator','Calculate the price after a discount and the amount saved.','Free Discount Calculator | Utiluna','Calculate the price after a discount and the amount saved with our free discount calculator.'),
('tva','fr','Calculateur TVA HT / TTC','Convertissez facilement un prix HT en TTC et inversement.','Calculateur TVA HT / TTC gratuit | Utiluna','Calculez rapidement un prix HT, TTC et le montant de TVA avec le taux de votre choix.'),
('tva','en','VAT Calculator','Convert prices between net and gross amounts with VAT.','VAT Calculator | Utiluna','Calculate net and gross prices and the VAT amount using your chosen rate.'),
('regle-de-trois','fr','Règle de trois','Résolvez rapidement vos calculs de proportionnalité.','Règle de trois en ligne | Utiluna','Résolvez rapidement un calcul de proportionnalité avec notre calculateur de règle de trois gratuit.'),
('regle-de-trois','en','Rule of Three Calculator','Quickly solve proportionality calculations.','Rule of Three Calculator | Utiluna','Quickly solve proportionality calculations with our free rule of three calculator.'),
('age','fr','Calculateur d’âge','Calculez précisément votre âge à partir d’une date de naissance.','Calculateur d’âge | Utiluna','Calculez précisément votre âge en années, mois et jours.'),
('age','en','Age Calculator','Calculate your exact age from a birth date.','Age Calculator | Utiluna','Calculate your exact age in years, months, and days.'),
('duree','fr','Calculateur de durée','Calculez la durée entre deux dates ou deux horaires.','Calculateur de durée | Utiluna','Calculez facilement une durée entre deux dates ou deux horaires.'),
('duree','en','Duration Calculator','Calculate the duration between two dates or times.','Duration Calculator | Utiluna','Easily calculate a duration between two dates or two times.'),
('vitesse-telechargement','fr','Mbps ↔ Mo/s','Convertissez une vitesse Internet entre Mbps et Mo/s.','Convertisseur Mbps Mo/s | Utiluna','Convertissez une vitesse Internet entre Mbps, Gbps, Ko/s, Mo/s et Go/s.'),
('vitesse-telechargement','en','Download Speed Converter','Convert internet speed between Mbps and MB/s.','Download Speed Converter | Utiluna','Convert internet speeds between Mbps, Gbps, KB/s, MB/s, and GB/s.'),
('temps-telechargement','fr','Temps de téléchargement','Estimez le temps nécessaire pour télécharger un fichier.','Temps de téléchargement | Utiluna','Estimez le temps nécessaire pour télécharger un fichier selon sa taille et votre débit.'),
('temps-telechargement','en','Download Time Calculator','Estimate how long it takes to download a file.','Download Time Calculator | Utiluna','Estimate how long it takes to download a file based on its size and connection speed.'),
('taille-fichier','fr','Calculateur de taille de fichier','Estimez la taille d’un fichier selon sa durée et son débit.','Calculateur de taille de fichier | Utiluna','Estimez la taille d’un fichier selon sa durée et son débit.'),
('taille-fichier','en','File Size Calculator','Estimate a file size from its duration and bitrate.','File Size Calculator | Utiluna','Estimate a file size from its duration and bitrate.'),
('convertisseur-taille','fr','Convertisseur de taille','Convertissez facilement Ko, Mo, Go, To et autres unités.','Convertisseur de taille de fichier | Utiluna','Convertissez facilement une taille de fichier entre octets, Ko, Mo, Go et To.'),
('convertisseur-taille','en','File Size Converter','Convert file sizes between bytes, KB, MB, GB, TB, and more.','File Size Converter | Utiluna','Easily convert file sizes between bytes, KB, MB, GB, and TB.'),
('mots-caracteres','fr','Compteur de mots et caractères','Comptez les mots, caractères, espaces et lignes d’un texte.','Compteur de mots et caractères | Utiluna','Comptez les mots, caractères, espaces et lignes d’un texte.'),
('mots-caracteres','en','Word and Character Counter','Count words, characters, spaces, and lines in a text.','Word and Character Counter | Utiluna','Count words, characters, spaces, and lines in a text.'),
('bitrate-video','fr','Calculateur bitrate vidéo','Calculez le bitrate ou la taille approximative d’une vidéo.','Calculateur de bitrate vidéo | Utiluna','Calculez le bitrate ou la taille approximative d’une vidéo.'),
('bitrate-video','en','Video Bitrate Calculator','Calculate video bitrate or approximate file size.','Video Bitrate Calculator | Utiluna','Calculate video bitrate or approximate file size.');

insert into public.tool_categories (tool_id,category_key) values
('pourcentage','calculs'),('reduction','calculs'),('tva','calculs'),('regle-de-trois','calculs'),
('age','dates'),('duree','dates'),('vitesse-telechargement','informatique'),('temps-telechargement','informatique'),
('taille-fichier','informatique'),('convertisseur-taille','informatique'),('mots-caracteres','fichiers'),('bitrate-video','video');

insert into public.tool_tags (tool_id,tag) values
('pourcentage','%'),('pourcentage','évolution'),('pourcentage','différence'),('pourcentage','variation'),('pourcentage','taux'),
('reduction','remise'),('reduction','promotion'),('reduction','solde'),('reduction','prix'),('reduction','économie'),
('tva','taxe'),('tva','hors taxe'),('tva','toutes taxes'),('tva','prix'),('tva','tva'),('tva','ht'),('tva','ttc'),
('regle-de-trois','proportion'),('regle-de-trois','proportionnalité'),('regle-de-trois','ratio'),('regle-de-trois','quantité'),('regle-de-trois','prix'),
('age','anniversaire'),('age','naissance'),('age','date'),
('duree','temps'),('duree','date'),('duree','heures'),('duree','jours'),('duree','intervalle'),
('vitesse-telechargement','internet'),('vitesse-telechargement','débit'),('vitesse-telechargement','connexion'),('vitesse-telechargement','megabit'),('vitesse-telechargement','mégaoctet'),
('temps-telechargement','download'),('temps-telechargement','internet'),('temps-telechargement','débit'),('temps-telechargement','fichier'),('temps-telechargement','durée'),
('taille-fichier','poids'),('taille-fichier','taille'),('taille-fichier','stockage'),('taille-fichier','vidéo'),('taille-fichier','audio'),('taille-fichier','bitrate'),
('convertisseur-taille','ko'),('convertisseur-taille','mo'),('convertisseur-taille','go'),('convertisseur-taille','to'),('convertisseur-taille','octets'),('convertisseur-taille','stockage'),
('mots-caracteres','texte'),('mots-caracteres','lettres'),('mots-caracteres','compter'),('mots-caracteres','ligne'),('mots-caracteres','paragraphes'),
('bitrate-video','vidéo'),('bitrate-video','qualité'),('bitrate-video','débit'),('bitrate-video','encodage'),('bitrate-video','compression');

insert into public.tool_aliases (tool_id,alias)
select tool_id,tag from public.tool_tags;