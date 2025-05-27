# Projeto: desenvolvimento de aplicação web com persistência de dados do lado do servidor

Imagens do **site criado**:  
![screenshot](img/screenshot.png "screenshot")

Acesso: https://elc1090.github.io/project3-2025a-alissonbc/html/


#### Desenvolvedor
Álisson Braga Canabarro, Ciência da Computação


##### Descrição
É um site de reviews de filmes publicadas pelos próprios usuário, que permite postar reviews de forma publica ou privada.
Faz uso de firebase para lidar com a autenticação de usuário e para armazenar as reviews no firestore, permitindo adicionar, editar e deletar reviews pelo usuário que publicou.




#### Desenvolvimento
Fiz algo similar ao [Projeto 2](https://github.com/elc1090/project2-2025a-alissonbc), no projeto 2 eu criei cards em formato de grid, que possuiam imagem e descrição.
A diferença é que para o projeto 3 eu fiz os cards de review terem tamanho fixo, mas permitindo clicar no card, para abrir a review completa em um card de overlay.
Para salvar as reviews é preciso ter uma conta, então utilizei o firebase-auth, porém o firebase auth pede no minimo email e senha, mas como o site é simples e eu queria deixar fácil de utilizar, eu fiz com que o usuário só precise de username e senha. Por tras dos panos eu adiciono um "@emailfalso.fal" ao final do username antes de enviar para o firebase.



#### Tecnologias

- HTML
- CSS
- JS
- Bootstrap
- Firebase

#### Ambiente de desenvolvimento

VS Code com as extensões:
- HTML CSS Support

#### Referências e créditos


Chat GPT, exemplo resumido de prompt:
Quando eu faço `btnDeletar.classList.add("d-none");`, os botões vizinho de btnDeletar se movem para ocupar o espaço extra. Como fazer para desativar visualmente o btnDeletar sem que os outros botões mudem de posição ?



---
Projeto entregue para a disciplina de [Desenvolvimento de Software para a Web](http://github.com/andreainfufsm/elc1090-2025a) em 2025a
