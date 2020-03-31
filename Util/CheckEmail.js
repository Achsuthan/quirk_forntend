export default function (email) {
    let pattern
    pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/;
    // pattern = /\S+@\S+\.\S+/;
    return pattern.test(email);
}