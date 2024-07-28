# projetoRBM

Para rodar o projeto na sua maquina use os comandos: 
```
npm run build
npm run start
```
Todas as rotas agora precisão de autenticação, para isso é preciso criar um usuário na rota post:

{endereçodahospedagem}/api/teste_student/user 

e realizar o login na rota get:

{endereçodahospedagem}/api/teste_student/user 

e então usar o token na requisição das outras rotas

A rota para os dados do grafico 1 é localhost:3000/api/teste_student/grafico1/:course_id/:period_init/:period_end/:disciplines_ids

curricular grade: 
http://localhost:3000/api/teste_student/disciplines/curricular_grade

exemplo de listagem:
http://localhost:3000/api/teste_student/disciplines/disciplinesByPeriod/3

Na maquina virtual foram instalados o nodejs com o npm, o pm2 para gerenciar processos e manter o servidor rodando em background e o git

o comando de inicialização do processo deve ser feito na raiz, o caminho é projetoRBM/projetoRBM, o comando é:

```
 nohup pm2 start ecosystem.config.js &
```
