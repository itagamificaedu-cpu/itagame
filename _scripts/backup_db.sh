#!/bin/sh
# Backup diário do banco do ItaGame — roda no VPS via cron (ver _docs ou
# README). Faz um dump comprimido do Postgres e apaga backups com mais de
# $DIAS_PARA_MANTER dias, pra não encher o disco do VPS aos poucos.
#
# Uso no VPS (crontab -e):
#   0 3 * * * /root/itagame/_scripts/backup_db.sh >> /root/itagame_backups/backup.log 2>&1

set -eu

CONTAINER_DB="itagame-itagame_db-1"
USUARIO_DB="itagame"
NOME_DB="itagame"
PASTA_BACKUP="/root/itagame_backups"
DIAS_PARA_MANTER=14

mkdir -p "$PASTA_BACKUP"

DATA=$(date +%Y-%m-%d_%H%M%S)
ARQUIVO="$PASTA_BACKUP/itagame_$DATA.sql.gz"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Iniciando backup em $ARQUIVO"

docker exec "$CONTAINER_DB" pg_dump -U "$USUARIO_DB" "$NOME_DB" | gzip > "$ARQUIVO"

TAMANHO=$(du -h "$ARQUIVO" | cut -f1)
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup concluído ($TAMANHO)"

# Apaga backups antigos além do prazo de retenção.
find "$PASTA_BACKUP" -name "itagame_*.sql.gz" -mtime "+$DIAS_PARA_MANTER" -print -delete

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Limpeza de backups antigos concluída"
