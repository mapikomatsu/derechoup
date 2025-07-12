
const container = document.getElementById("contenedor-ciclos");
const resetBtn = document.getElementById("reset-btn");
const modoBtn = document.getElementById("modo-btn");
let completados = JSON.parse(localStorage.getItem("cursosCompletados") || "[]");

fetch("cursos_derecho_up.json")
  .then(res => res.json())
  .then(data => {
    const cursos = data.cursos;
    const ciclos = [...new Set(cursos.map(c => c.ciclo))].sort((a, b) => a - b);

    ciclos.forEach(ciclo => {
      const div = document.createElement("div");
      div.classList.add("ciclo");
      div.innerHTML = `<h2>Ciclo ${ciclo}</h2>`;
      const cursosDelCiclo = cursos.filter(c => c.ciclo === ciclo);

      cursosDelCiclo.forEach(curso => {
        const bloqueado = !curso.prerrequisitos.every(p => completados.includes(p));
        const wrapper = document.createElement("div");
        wrapper.className = "curso" + (bloqueado ? " bloqueado" : "");

        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = curso.codigo;
        input.checked = completados.includes(curso.codigo);
        input.disabled = bloqueado;
        input.addEventListener("change", () => {
          if (input.checked) completados.push(curso.codigo);
          else completados = completados.filter(c => c !== curso.codigo);
          localStorage.setItem("cursosCompletados", JSON.stringify(completados));
          location.reload();
        });

        const label = document.createElement("label");
        label.htmlFor = curso.codigo;
        label.innerHTML = `<strong>${curso.nombre}</strong> <br> Código: ${curso.codigo} | Créditos: ${curso.creditos} | Tipo: ${curso.tipo}`;

        wrapper.appendChild(input);
        wrapper.appendChild(label);
        div.appendChild(wrapper);
      });

      container.appendChild(div);
    });
  });

resetBtn.addEventListener("click", () => {
  localStorage.removeItem("cursosCompletados");
  location.reload();
});

modoBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
