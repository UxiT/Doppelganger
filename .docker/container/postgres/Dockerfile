FROM postgres:17-alpine3.20

ARG DEBIAN_FRONTEND=noninteractive

ENV TZ=UTC

COPY .docker/config/postgres.conf /etc/postgres.conf

CMD [ "postgres", "-c", "config_file=/etc/postgres.conf" ]